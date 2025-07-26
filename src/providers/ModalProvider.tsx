import { createContext, useContext, useState, type ReactNode, type FC } from 'react';
import { ModalWrapper, type ModalWrapperProps } from '../components/ModalWrapper/ModalWrapper';

interface ListItem<P = any> {
  id: string;
  component: FC<P>;
  componentProps: P;
  isOpen?: boolean;
  wrapperProps?: Partial<ModalWrapperProps>;
}

interface ModalContextType {
  openModal: <P>(
    component: FC<P>,
    componentProps: P,
    wrapperProps?: Partial<ModalWrapperProps>,
  ) => string;
  closeModal: (id: string) => void;
}

const startZIndex = 1000;

export const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalList, setModalList] = useState<ListItem[]>([]);

  function openModal<P>(
    component: FC<P>,
    componentProps: P,
    wrapperProps?: Partial<ModalWrapperProps>,
  ) {
    const id = crypto.randomUUID();
    setModalList((prev) => [...prev, { id, component, componentProps, wrapperProps }]);
    return id;
  }

  function closeModal(id: string) {
    setModalList((prev) =>
      prev.map((modal) => (modal.id === id ? { ...modal, isOpen: false } : modal)),
    );
    setTimeout(() => {
      setModalList((prev) => prev.filter((modal) => modal.id !== id));
    }, 300);
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalList.map(
        ({ id, component: Component, componentProps, isOpen = true, wrapperProps }, i) => (
          <ModalWrapper
            close={() => closeModal(id)}
            zIndex={startZIndex + i}
            isOpen={isOpen}
            {...wrapperProps}
            key={id}>
            {<Component {...componentProps} close={() => closeModal(id)} />}
          </ModalWrapper>
        ),
      )}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModalContext must be used within a ModalProvider');
  return ctx;
};
