import React, { Component } from "react";
import copy from 'copy-to-clipboard';

export default class App extends Component {
  state = { colorHex: "#000000", rgb: "rgb(0,0,0)" };

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  componentDidMount() {
    window.ipcRenderer.send("app-loaded");

    window.ipcRenderer.on("copy-color" , (event) => {
      copy(this.state.colorHex);
    });


    window.ipcRenderer.on("progress-update", (event, colorHex) => {
      colorHex = "#" + colorHex;
      let colorRGB = this.hexToRgb(colorHex);
      this.setState({
        colorHex,
        rgb: `rgb(${colorRGB.r},${colorRGB.g},${colorRGB.b})`,
      });
    });
  }

  componentWillUnmount() {
    window.ipcRenderer.send("app-close");
  }


  render() {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "90vh",
          maxHeight: "90vh",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          fontFamily: 'Balsamiq Sans'
                }}
      >
        <div
          style={{
            width: "95vw",
            height: "40vh",
            backgroundColor: this.state.colorHex,
          }}
        ></div>

        <div style={{ textAlign: "center" }}>
          <p>{this.state.colorHex}</p>
          <p>{this.state.rgb}</p>
          <p>Press Ctrl+C to copy this color to clipboard</p>
        </div>
      </div>
    );
  }
}
