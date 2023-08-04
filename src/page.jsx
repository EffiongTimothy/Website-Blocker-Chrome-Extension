import React from "react";

const Start =()=>{
    return(
        <div className="App">
        <div className="top">
        <img src={logo}></img>
        <h1>Bime</h1>
        </div>
        <div className="inputs-box">
        <input
          type="text"
          value={urlToBlock}
          onChange={(e) => setUrlToBlock(e.target.value)}
          placeholder="Enter URL to block"
        />
        <div className="button-box">
          <button onClick={blockSite}>Block</button>
          <button onClick={unblockSite}>Unblock</button>
        </div>
      </div>
      </div>
    
    )
}