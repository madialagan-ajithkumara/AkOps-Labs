package sandbox

import "github.com/docker/docker/api/types/filters"

// filtersForLabel builds a Docker filter Args matching containers that
// carry the given label=value pair. Kept in its own tiny file since it's
// a pure helper with no lifecycle logic.
func filtersForLabel(key, value string) filters.Args {
	f := filters.NewArgs()
	f.Add("label", key+"="+value)
	return f
}
