export type Result<T> = {
  key: string
  value: T
  events: {
    ref: (element: HTMLElement | null) => void
    onMouseDown: (event: React.MouseEvent<HTMLElement>) => void
  }
}

// 座標情報
export type Position = {
  x: number
  y: number
}

type DnDItem<T> = {
  value: T // useDnDSort で渡された配列の要素
  key: string
  position: Position // ドラッグ中の要素の座標
  element: HTMLElement // DOM情報
}

export type DndRef<T> = {
  dndItems: DnDItem<T>[] // 並び替える全ての要素の配列
  keys: Map<T, string>
  canCheckHovered: boolean // 重なり判定
  pointerPosition: Position // マウスポインターの座標
  dragElement: DnDItem<T> | null // ドラッグ中の要素
}

// type DnDSortResult<T> = {
// }
