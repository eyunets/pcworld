import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { createContext, useContext } from "react";
import LoadingPage from "../../components/common/LoadingPage";
import { FacetsContext } from "./facets-context-types";
import useProvideFacets from "./facets-provider";

interface ProvideFacetsProps {
  children: React.ReactElement[] | React.ReactElement;
}

const facetContext = createContext<FacetsContext | null>(null);

export const ProvideFacets: React.FC<ProvideFacetsProps> = ({
  children,
}: ProvideFacetsProps) => {
  const { loading, snackbar, closeSnackbar, ...facets } = useProvideFacets();

  return (
    <facetContext.Provider value={facets}>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={closeSnackbar}
          >
            <Alert
              onClose={closeSnackbar}
              severity={snackbar.severity}
              elevation={6}
              variant="filled"
            >
              {snackbar.text}
            </Alert>
          </Snackbar>
          {children}
        </>
      )}
    </facetContext.Provider>
  );
};

export const useFacets = (): FacetsContext => {
  return useContext(facetContext) as FacetsContext;
};
