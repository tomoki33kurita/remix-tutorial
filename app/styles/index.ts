type Style<T extends HTMLElement> = React.HTMLAttributes<T>["style"]

export const bodyStyle: Style<HTMLDivElement> = {
  height: "100vh",
  display: "flex",
  overflow: "hidden",
  alignItems: "center",
  justifyContent: "center",
}

export const containerStyle: Style<HTMLDivElement> = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: "350px",
  maxHeight: "500px",
}

export const imageCardStyle: Style<HTMLDivElement> = {
  cursor: "grab",
  userSelect: "none",
  width: "100px",
  height: "130px",
  overflow: "hidden",
  borderRadius: "5px",
  margin: 3,
}

export const imageStyle: Style<HTMLImageElement> = {
  pointerEvents: "none",
  objectFit: "cover",
  width: "100%",
  height: "100%",
}
