import './teddy.css';
const Teddy = () => {
  return (
    <div aria-label="Loading Teddy" role="img" className="article">
      <div className="body">
        <div className="shadow" />
        <div className="chest">
          <div className="leg" />
          <div className="leg" />
          <div className="arm" />
          <div className="arm" />
        </div>
      </div>
      <div className="head">
        <div className="ear" />
        <div className="ear" />
        <div className="face">
          <div className="eye" />
          <div className="eye" />
          <div className="nose" />
          <div className="cheek" />
          <div className="cheek" />
          <div className="mouth" />
          <div className="hair" />
        </div>
      </div>
    </div>
  );
};

export default Teddy;
