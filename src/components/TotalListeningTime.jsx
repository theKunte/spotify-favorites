//Displays the total hours of music listened.
import React from "react";

const TotalListeningTime = ({ totalTime }) => {
  const hours = Math.floor({ totalTime } / 3600);
  const minutes = Math.floor((totalTime % 3600) / 60);

  return (
    <div className="total-time">
      <h2>Total Listening Time</h2>
      <p>
        {hours} hours and {minutes} minutes
      </p>
    </div>
  );
};

export default TotalListeningTime;
