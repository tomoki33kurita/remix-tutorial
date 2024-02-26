import { useRef, useState } from "react"
import { DndRef, Position, Result } from "~/types"

const isHover = (event: MouseEvent, element: HTMLElement): boolean => {
  const clientX = event.clientX
  const clientY = event.clientY

  const rect = element.getBoundingClientRect()

  return (
    clientY < rect.bottom &&
    clientY > rect.top &&
    clientX < rect.right &&
    clientX > rect.left
  )
}

export const useDnDSort = <T>(defaultItems: T[]): Result<T>[] => {
  const [items, setItems] = useState(defaultItems)

  const dndState = useRef<DndRef<T>>({
    dndItems: [],
    keys: new Map(),
    canCheckHovered: true,
    pointerPosition: { x: 0, y: 0 },
    dragElement: null,
  }).current

  const onMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event
    const { dndItems, dragElement, pointerPosition } = dndState

    // ドラッグしてない場合は処理を終了
    if (!dragElement) return
    // 300ms 以内では確認できないようにする
    if (!dndState.canCheckHovered) return
    // 確認できないようにする
    dndState.canCheckHovered = false
    // 300ms 後に確認できるようにする
    setTimeout(() => (dndState.canCheckHovered = true), 10)
    // ドラッグ中の要素のインデックスを取得
    const dragIndex = dndItems.findIndex((item) => item.key === dragElement.key)
    // ホバー中の要素のインデックスを取得
    const hoveredIndex = dndItems.findIndex(
      (item, i) => i !== dragIndex && isHover(event, item.element)
    )
    if (hoveredIndex !== -1) {
      console.log("ホバーしているよ")

      // カーソル位置を更新
      dndState.pointerPosition.x = clientX
      dndState.pointerPosition.y = clientY

      // 要素の入れ替え
      dndItems.splice(dragIndex, 1)
      dndItems.splice(hoveredIndex, 0, dragElement)

      // ドラッグ要素の座標を更新
      const { left: x, top: y } = dragElement.element.getBoundingClientRect()
      dragElement.position = { x, y }

      setItems(dndItems.map((item) => item.value))
    }

    // マウスポインタの移動量を計算
    const x = clientX - pointerPosition.x
    const y = clientY - pointerPosition.y

    const dragStyle = dragElement.element.style

    dragStyle.zIndex = "100"
    dragStyle.cursor = "grabbing"
    dragStyle.transform = `translate(${x}px, ${y}px)`
  }

  const onMouseUp = () => {
    const { dragElement } = dndState
    if (!dragElement) return

    const dragStyle = dragElement.element.style

    dragStyle.zIndex = ""
    dragStyle.cursor = ""
    dragStyle.transform = ""

    dndState.dragElement = null

    window.removeEventListener("mouseup", onMouseUp)
    window.removeEventListener("mousemove", onMouseMove)
  }

  return items.map((value: T): Result<T> => {
    const key = dndState.keys.get(value) || Math.random().toString(16)
    dndState.keys.set(value, key)
    return {
      key,
      value,
      events: {
        ref: (element: HTMLElement | null) => {
          if (!element) return

          const { dndItems, dragElement, pointerPosition } = dndState

          // 位置をリセット
          element.style.transform = ""

          // 要素の位置情報を取得
          const { left: x, top: y } = element.getBoundingClientRect()
          const position: Position = { x, y }

          const itemIndex = dndItems.findIndex((item) => item.key === key)

          // 要素が存在しない場合は追加して終了
          if (itemIndex === -1) {
            return dndItems.push({ key, value, element, position })
          }

          if (dragElement?.key === key) {
            // 要素入れ替え時のズレを計算
            const dragX = dragElement.position.x - position.x
            const dragY = dragElement.position.y - position.y

            // 要素の入れ替え時のズレをなくす
            element.style.transform = `translate(${dragX}px, ${dragY}px)`

            // マウスポインタのズレも考慮して位置情報を更新
            pointerPosition.x -= dragX
            pointerPosition.y -= dragY
          }

          //   // ドラッグ要素以外の要素をアニメーションさせながら移動させる
          //   if (dragElement?.key !== key) {
          //     const item = dndItems[itemIndex]

          //     // 前回の座標を計算
          //     const x = item.position.x - position.x
          //     const y = item.position.y - position.y

          //     // 要素を前回の位置に留めておく
          //     element.style.transition = ""
          //     element.style.transform = `translate(${x}px,${y}px)`

          //     // 一フレーム後に要素をアニメーションさせながら元に位置に戻す
          //     requestAnimationFrame(() => {
          //       element.style.transform = ""
          //       element.style.transition = "all 300ms"
          //     })
          //   }

          // 要素が存在する場合は位置情報を更新
          dndState.dndItems[itemIndex] = { key, value, element, position }
        },
        onMouseDown: (event: React.MouseEvent<HTMLElement>) => {
          // ドラッグ中の要素
          const element = event.currentTarget

          // マウスポインタの座標を更新
          dndState.pointerPosition.x = event.clientX
          dndState.pointerPosition.y = event.clientY

          element.style.transform = "" // アニメーション無効化
          element.style.cursor = "grabbing" // カーソルデザインをへのう

          // ドラッグ中の要素の座標を取得
          const { left: x, top: y } = element.getBoundingClientRect()
          const position: Position = { x, y }

          // ドラッグ中の要素を保持
          dndState.dragElement = { value, key, position, element }

          //   // windowに2つのイベントを登録
          window.addEventListener("mouseup", onMouseUp)
          window.addEventListener("mousemove", onMouseMove)
        },
      },
    }
  })
}
