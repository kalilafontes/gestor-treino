import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { useMe } from '@/features/auth/hooks/use-me';
import {
  availableContexts,
  readPreference,
  savePreference,
  validatePreference,
  type ActiveContext,
} from './context';

interface ContextValue {
  activeContext: ActiveContext | null;
  contexts: ActiveContext[];
  selectContext: (context: ActiveContext) => void;
}

const ActiveContextContext = createContext<ContextValue | null>(null);

export function ActiveContextProvider({ children }: PropsWithChildren) {
  const { data: user } = useMe();
  const contexts = useMemo(() => (user ? availableContexts(user) : []), [user]);
  const [selection, setSelection] = useState<ActiveContext | null>(() => null);
  const activeContext = useMemo(() => {
    if (!user) return null;
    const selected =
      selection?.kind === 'academy'
        ? validatePreference(contexts, selection)
        : selection?.kind === 'global'
          ? (contexts.find((context) => context.kind === 'global') ?? null)
          : null;
    const persisted = validatePreference(contexts, readPreference());
    return selected ?? persisted ?? (contexts.length === 1 ? (contexts[0] ?? null) : null);
  }, [contexts, selection, user]);

  const selectContext = (context: ActiveContext) => {
    setSelection(context);
    savePreference(context);
  };

  return (
    <ActiveContextContext.Provider value={{ activeContext, contexts, selectContext }}>
      {children}
    </ActiveContextContext.Provider>
  );
}

export function useActiveContext() {
  const value = useContext(ActiveContextContext);
  if (!value) throw new Error('ActiveContextProvider ausente');
  return value;
}
