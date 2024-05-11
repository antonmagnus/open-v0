import { SnackbarOptions } from '../model';
import useStore from './useStore';

function useSnackbar() {
  const setSnackbarOptions = useStore((store) => store.setSnackbarOptions);

  const addSnackbar = (snackbarOptions: SnackbarOptions) => {
    setSnackbarOptions(snackbarOptions);

    setTimeout(() => {
      setSnackbarOptions(undefined);
    }, 5000);
  };
  return { addSnackbar };
}
export default useSnackbar;
