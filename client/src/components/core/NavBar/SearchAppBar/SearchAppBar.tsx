import React, { useEffect, useMemo, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { Box, InputBase, Popper } from "@material-ui/core";
import { Autocomplete, FilterOptionsState } from "@material-ui/lab";
import useSearchAppBarStyles from "./search-app-bar-styles";
import { getSearchResults, Product } from "../../../../api/product";
import { asyncScheduler, BehaviorSubject, scheduled } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  skip,
  switchMap,
} from "rxjs/operators";
import clsx from "clsx";
import { useFacets } from "../../../../context";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { matchSorter } from "match-sorter";
import additionalSearchOptions from "./additional-search-options";
import { useHistory } from "react-router";

export interface SearchOption {
  name: string;
  slug: string;
  type: "категории" | "продукты";
}

const searchSubject = new BehaviorSubject("");

const searchResultObs$ = searchSubject.pipe(
  skip(1),
  filter((val) => val.length > 1),
  debounceTime(500),
  distinctUntilChanged(),
  switchMap((val) =>
    getSearchResults({ keywords: val, limit: 10 }).pipe(
      map((res) => res.response.products),
      catchError((err) => {
        return scheduled(err, asyncScheduler);
      })
    )
  ),
  map((products: Product[]): SearchOption[] =>
    products.map((product) => ({
      name: product.name,
      slug: product.slug,
      type: "продукты",
    }))
  )
);

const getRelatetSearchType = (type: string) => {
  switch (type) {
    case "категории":
      return "category";
    case "продукты":
      return "product";
  }
};

const filterOptions = (
  options: SearchOption[],
  { inputValue }: FilterOptionsState<SearchOption>
) => {
  const sortedCategories = matchSorter(
    options.filter((option) => option.type === "категории"),
    inputValue,
    { keys: ["name"] }
  );

  const sortedProducts = matchSorter(
    options.filter((option) => option.type === "продукты"),
    inputValue,
    { keys: ["name"] }
  );

  return [...sortedCategories, ...sortedProducts];
};

const useCategoriesOptions = (): SearchOption[] => {
  const { categories } = useFacets();

  return useMemo(
    () => [
      ...categories.map(
        (category): SearchOption => ({
          name: category.name,
          slug: category.slug,
          type: "категории",
        })
      ),
      ...additionalSearchOptions,
    ],
    [categories]
  );
};

const SearchAppBar: React.FC = () => {
  const classes = useSearchAppBarStyles();
  const history = useHistory();
  const [options, setOptions] = useState<SearchOption[]>([]);
  const [closePopper, setClosePopper] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const categoriesOptions = useCategoriesOptions();

  useEffect(() => {
    const subscription = searchResultObs$.subscribe({
      next: (results) => {
        setOptions([...categoriesOptions, ...results]);
      },
      error: (err) => console.log(err),
    });
    return () => subscription.unsubscribe();
  }, [categoriesOptions]);

  const runSearchKeywords = () => {
    if (inputValue.length > 0) {
      const matchValue = matchSorter(categoriesOptions, inputValue, {
        keys: [
          { threshold: matchSorter.rankings.WORD_STARTS_WITH, key: "name" },
        ],
      })[0];
      if (matchValue) {
        history.push(`/category/${matchValue.slug}`);
      } else {
        history.push(
          `/search/${encodeURIComponent(
            inputValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          )}`
        );
      }
    }
  };

  const handleOptionChange = (
    _event: React.ChangeEvent<Record<string, unknown>>,
    value: string | SearchOption | null
  ) => {
    if (value) {
      if (typeof value === "string") {
        //run search based on input keywords
        runSearchKeywords();
      } else if (typeof value === "object") {
        // run search based on option selected
        history.push(`/${getRelatetSearchType(value.type)}/${value.slug}`);
      }
      setClosePopper(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    searchSubject.next(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    if (value.length < 2 && !closePopper) {
      setClosePopper(true);
    } else if (value.length > 1 && closePopper) {
      setClosePopper(false);
    }
  };

  return (
    <Box className={classes.search}>
      <Box className={classes.searchIcon} onClick={runSearchKeywords}>
        <SearchIcon />
      </Box>
      <Autocomplete
        classes={{
          paper: classes.paper,
          popper: clsx(classes.popper, { [classes.closePopper]: closePopper }),
        }}
        PopperComponent={(props) => (
          <Popper {...props} placement="bottom-end" />
        )}
        ListboxProps={{ style: { maxHeight: "60vh" } }}
        id="pc-world-search"
        freeSolo
        options={options}
        getOptionLabel={(option) =>
          option.name || (option as unknown as string)
        }
        groupBy={(option) => option.type}
        onChange={handleOptionChange}
        filterOptions={filterOptions}
        value={null}
        renderInput={(params) => (
          <InputBase
            placeholder="Поиск…"
            fullWidth
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            ref={params.InputProps.ref}
            inputProps={{ ...params.inputProps }}
            onChange={handleInputChange}
            value={inputValue}
          />
        )}
        renderOption={(option, { inputValue }) => {
          const matches = match(option.name, inputValue);
          const parts = parse(option.name, matches);

          return (
            <div>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{ fontWeight: part.highlight ? 700 : 400 }}
                >
                  {part.text}
                </span>
              ))}
            </div>
          );
        }}
      />
    </Box>
  );
};

export default SearchAppBar;
