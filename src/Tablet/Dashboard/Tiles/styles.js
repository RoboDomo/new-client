const styles = {
  default_tile: {
    width: 128,
    height: 124,
    border: "4px outset white",
    margin: 1,
    borderRadius: 8,
    justifyContent: "center",
    textAlign: "center",
    // display: "flex",
    // flexDirection: "column",
  },

  tile(width, height) {
    const tile = Object.assign({}, this.default_tile);
    tile.width *= width;
    tile.height *= height;
    tile.width -= 4;
    tile.height -= 4;
    tile.gridColumnEnd = `span ${width}`;
    tile.gridRowEnd = `span ${height}`;
    return tile;
  },
};

//
export default styles;
