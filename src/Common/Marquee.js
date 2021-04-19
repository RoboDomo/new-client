import React from "react";

// let index = 0;
class Marquee extends React.Component {
  constructor(props) {
    super();
    const getTextWidth = (text) => {
      text = document.createElement("span");
      document.body.appendChild(text);

      // text.style.font = "times new roman";
      text.style.fontSize = 20 + "px";
      text.style.height = "auto";
      text.style.width = "auto";
      text.style.position = "absolute";
      text.style.whiteSpace = "no-wrap";
      text.innerHTML = text;

      const width = Math.ceil(text.clientWidth);
      console.log("width", width);
      // formattedWidth = width + "px";

      document.body.removeChild(text);
      return width;
    };

    this.myElement = React.createRef();
    this.text = props.text;
    this.scrollAmount = 1;
    this.last = -10000;
    this.speed = props.speed || 10;

    this.width = getTextWidth(this.text);
    this.direction = -1;

    this.state = {
      scroll: 0,
    };
    this.scroll = 0;
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.scroll += this.scrollAmount;
      const el = this.myElement.current;
      el.scrollLeft = this.scroll;
      if (this.last !== undefined && el.scrollLeft === this.last) {
        this.scrollAmount = -this.scrollAmount;
        this.last = -1000000000000;
      } else {
        this.last = el.scrollLeft;
      }
      // console.log(el.scrollLeft, this.last);
      // console.log(el.scrollLeft, this.scroll);
      // const el = document.getElementById(this.id);
      // console.log(this.scroll, this.id, el.scrollLeft);
      // console.dir(el);
      // this.setState({ scroll: scroll + 1 });
      // this.myElement.current.scrollLeft = this.scroll;
      // this.myElement.current.scrollTo({ top: 0, left: this.scroll, behavior: "smooth"});
      // console.log(this.myElement.current.scrollLeft, this.scroll);
    }, this.speed);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    console.log("render", this.state.scroll);
    return (
      <div
        style={{
          width: "100",
          height: 20,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "scroll",
            /* paddingRight: this.width, */
          }}
          ref={this.myElement}
        >
          {this.text}
        </div>
      </div>
    );
  }
}

export default Marquee;
