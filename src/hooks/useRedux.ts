import isEqual from "lodash/isEqual";
import pick from "lodash/pick";
import { useSelector } from "react-redux";

import { Store, StoreKey } from "types/types.d";

export function useRedux(...keys: StoreKey[]) {
  return useSelector((state: Store) => pick(state, keys), isEqual);
}
