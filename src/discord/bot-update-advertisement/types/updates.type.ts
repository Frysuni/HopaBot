import type { NoUndefinedField } from "@common/types/no-undefined-field.type";
import type { RawUpdatesInterface } from "../interfaces/raw-updates.inteface";

export type Updates =
  NoUndefinedField<
    Omit<
      RawUpdatesInterface,
      'forVersion' | 'wasUsed'
    >
  >;

