import { images } from "~/constants/dnd"
import { useDnDSort } from "~/hooks/useDnDSort"
import { bodyStyle, containerStyle, imageCardStyle, imageStyle } from "~/styles"

export default function Kanban() {
  const results = useDnDSort(images)
  return (
    <div style={bodyStyle}>
      <div style={containerStyle}>
        {results.map((image) => (
          <div key={image.key} style={imageCardStyle} {...image.events}>
            <img src={image.value} alt="dnd" width={200} style={imageStyle} />
          </div>
        ))}
      </div>
    </div>
  )
}
