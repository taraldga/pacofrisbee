import * as React from 'react';

import { useUser } from 'util/UseUser';
import { getStatsForPlayer } from 'data/FrisbeegolfData';

const Stats: React.FC<{}> = () => {
  const user = useUser();
  const [currentUserStats, setCurrentUserStats] = React.useState<any>();

  React.useEffect(() => {
    const fetchData = async () => {
      console.log(user.name)
      const data = await getStatsForPlayer(user.name);
      console.log(data)
      setCurrentUserStats(data);
    }
    fetchData();
  }, [user.name])

  if(!currentUserStats) return <div />
  console.log(Object.keys(currentUserStats))
  return(
    <div className="center-wrapper">
      <h1> Super Barebone stats </h1>
      {Object.keys(currentUserStats).filter(key => typeof(currentUserStats[key]) === 'number').map(statKey => {
        return(
          <>
          <div style={{display:"flex",justifyContent:"space-between", padding: "20px"}}>
            <div><strong>{statKey}:</strong></div>
            <div>{currentUserStats[statKey]}</div>
          </div>
          <hr/>
          </>
          )
      })}
    </div>
  )
}

export default Stats;
