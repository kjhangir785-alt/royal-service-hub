import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { DEFAULT_CONTENT } from "../lib/data";

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);

  const refresh = async () => {
    try {
      const { data } = await api.get("/content");
      setContent({ ...DEFAULT_CONTENT, ...data });
    } catch (e) {
      // keep defaults on failure
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <ContentContext.Provider value={{ content, loaded, refresh }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  return ctx ? ctx.content : DEFAULT_CONTENT;
}

export function useContentCtx() {
  return useContext(ContentContext);
}
