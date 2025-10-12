import {
  useCreateUser,
  useLoginUser,
  useUpdateUser,
} from "./users";

const useUsers = () => {
  const {
    createUser,
    error: errorCreate,
    loading: loadingCreate,
    done: doneCreate,
  } = useCreateUser();

  const {
    loginUser,
    error: errorLogin,
    loading: loadingLogin,
    done: doneLogin,
  } = useLoginUser();

  const {
    updateUser,
    error: errorUpdate,
    loading: loadingUpdate,
    done: doneUpdate,
  } = useUpdateUser();

  return {
    createUser,
    loginUser,
    updateUser,
    loading: {
      create: loadingCreate,
      login: loadingLogin,
      update: loadingUpdate,
    },
    done: {
      create: doneCreate,
      login: doneLogin,
      update: doneUpdate,
    },
    error: {
      create: errorCreate,
      login: errorLogin,
      update: errorUpdate,
    },
  } as const;
};

export default useUsers;