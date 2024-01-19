import React, { ReactNode, createContext, useContext, useReducer } from "react";

interface ModalState {
  isPostModalOpen: boolean;
  postId: number;
}

const OPEN_POST_MODAL = 'OPEN_POST_MODAL';
const CLOSE_POST_MODAL = 'CLOSE_POST_MODAL';

type ModalAction = {
  type: string,
  payload?: {
    postId?: number,
  }
}

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case OPEN_POST_MODAL:
      return { ...state, isPostModalOpen: true, postId: action.payload?.postId ?? 0 };
    case CLOSE_POST_MODAL:
      return { ...state, isPostModalOpen: false };
    default:
      return state;
  }
}

const initialState: ModalState = {
  isPostModalOpen: false,
  postId: 0,
}

const ModalContext = createContext<{
  state: ModalState;
  dispatch: React.Dispatch<ModalAction>;
} | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  return (
    <ModalContext.Provider value={{ state, dispatch }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}