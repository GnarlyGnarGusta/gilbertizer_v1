import AutoPlayBump from "./AutoPlayBump";
import RootProvider from "./RootProvider";

export default function Root({ engine, children }) {
  return (
    <RootProvider engine={engine}>
      <AutoPlayBump>{children}</AutoPlayBump>
    </RootProvider>
  );
}
