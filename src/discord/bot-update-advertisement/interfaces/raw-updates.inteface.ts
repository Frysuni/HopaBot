export interface RawUpdatesInterface {
  readonly wasUsed?:              boolean
  readonly forVersion:            string
  readonly majorUpdates?:         string[]
  readonly minorUpdates?:         string[]
  readonly bugFixes?:             string[]
  readonly addedFunctionality?:   string[]
  readonly removedFunctionality?: string[]
  readonly other?:                string[]
}

