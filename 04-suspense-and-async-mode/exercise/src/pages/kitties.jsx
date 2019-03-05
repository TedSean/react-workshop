import React, {Suspense} from 'react';
import {unstable_createResource as createResource} from 'react-cache';
import './kitties.css';

const catApiResource = createResource(async() => {
  const response = await fetch('https://api.thecatapi.com/v1/images/search');
  const [result] = await response.json();
  const img = new Image();
  const src = await new Promise(resolve => {
    img.onload = () => resolve(result.url);
    img.src = result.url;
  });
  return src;
});

const KittyImage = ({ID}) => {
  const url = catApiResource.read(ID);
  return <img src={url} alt="randomKitty" className="kitty-image" />;
};

export default class Kitties extends React.Component {
  state = {
    catID: 0
  }

  _handleButtonClick = () => {
    this.setState({
      catID: Math.random()
    });
  }

  render = () => {
    const {catID} = this.state;
    return (
      <div className="kitties">
        <button onClick={this._handleButtonClick}>Show Another Kitty</button>
        <Suspense fallback={<div>Loading the kitty...</div>}
          maxDuration={3000}>
          <KittyImage ID={catID} />
        </Suspense>
      </div>
    );
  }
}
