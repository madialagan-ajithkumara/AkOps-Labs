package sandbox

import "encoding/json"

// resizeMessage is the only control message the frontend sends today. Kept
// as its own tiny type/parser so the wire protocol has exactly one place to
// grow if we ever add more control messages (e.g. "ping").
type resizeMessage struct {
	Resize *struct {
		Cols uint `json:"cols"`
		Rows uint `json:"rows"`
	} `json:"resize"`
}

func parseResizeMessage(data []byte) (struct{ Cols, Rows uint }, bool) {
	var m resizeMessage
	if err := json.Unmarshal(data, &m); err != nil || m.Resize == nil {
		return struct{ Cols, Rows uint }{}, false
	}
	return struct{ Cols, Rows uint }{Cols: m.Resize.Cols, Rows: m.Resize.Rows}, true
}
