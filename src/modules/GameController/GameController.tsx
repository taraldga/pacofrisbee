import * as React from "react";

import "./GameController.css";

import { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router-dom";

import HoleView from "components/HoleView/HoleView";
import { fetchGame, saveScore, updateGame } from "data/FrisbeegolfData";
import Pagination from "@material-ui/lab/Pagination";
import { GameData } from "types/Game";
import Button from "@material-ui/core/Button";
import ScoreDialog from "components/ScoreDialog/ScoreDialog";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
import Grid from "@material-ui/core/Grid";
import Save from "@material-ui/icons/Save";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import ScoreTable from "modules/ScoreTable/ScoreTable";
import { GameMenu } from "./GameMenu/GameMenu";
import { createInitialScoreEntries } from "util/createInitialScoreEntries";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export interface GameControllerState {
  gameId: string;
  currentHole: number;
  numberOfHoles?: number;
  game?: GameData;
  isSaving?: boolean;
  showStandings?: boolean;
  showSuccessBar?: boolean;
}
// Type whatever you expect in 'this.props.match.params.*'
type PathParamsType = {
  gameId: string;
  holeId: string;
};

// Your component own properties
type GameControllerProps = RouteComponentProps<PathParamsType> & {
  someString: string;
};
class GameController extends React.Component<
  GameControllerProps,
  GameControllerState
> {
  public constructor(props: GameControllerProps) {
    super(props);
    this.state = {
      gameId: props.match.params.gameId,
      currentHole: +props.match.params.holeId,
    };
  }

  public componentDidMount() {
    this.setupGame(this.state.gameId, this.state.currentHole);
  }

  public componentDidUpdate(prevProps: GameControllerProps, prevState: GameControllerState) {
    const {gameId, holeId} = this.props.match.params;
    if(this.state.gameId !== this.props.match.params.gameId || this.state.currentHole !== +this.props.match.params.holeId) {
      this.setState({
        gameId: gameId,
        currentHole: +holeId
      })
      this.setupGame(gameId, +holeId);
    }
  }

  private async setupGame(gameId: string, currentHole: number) {
    let currentGame;
    if (!this.state.game) {
      currentGame = (await fetchGame(gameId)) as GameData;
    } else {
      currentGame = this.state.game;
    }
    if (
      !currentGame.scoreEntries.some(
        (scoreEntry) => scoreEntry.hole === currentHole
      )
    ) {
      const initialScoreEntries = createInitialScoreEntries(
        currentGame.field,
        currentHole,
        currentGame.players,
        gameId
      );
      currentGame = {
        ...currentGame,
        scoreEntries: [
          ...currentGame.scoreEntries,
          ...initialScoreEntries,
        ],
      };
    }
    this.setState({
      game: currentGame,
      numberOfHoles: currentGame.field.holes.length,
    });
  }

  /**
   * Update a scoreentry
   * @param scoreEntry The scoreentry to update
   * @param newScore The new score to set on the updated scoreenry
   */
  private updateScoreEntry(playerId: string, hole: number, newScore: number) {
    if (!this.state.game) {
      return;
    }

    const newScoreEntries = [...this.state.game.scoreEntries];
    let scoreToUpdate = newScoreEntries.findIndex(
      (entry) => entry.playerId === playerId && entry.hole === hole
    );
    if (scoreToUpdate > -1) {
      newScoreEntries[scoreToUpdate].score = newScore;
      newScoreEntries[scoreToUpdate].updated = true;
      const newGame =  {
        ...this.state.game,
        scoreEntries: newScoreEntries,
      }
      this.setState({
        game: newGame,
      });
      return newScoreEntries;
    }
  }

  private isDataDirty = () => {
    return this.state.game?.scoreEntries.some(
      (scoreEntry) => scoreEntry.new || scoreEntry.updated
    );
  };

  private toggleShowStandings() {
    this.setState({
      showStandings: !this.state.showStandings,
    });
  }

  private async onSave() {
    if (this.state.game) {
      this.setState({
        isSaving: true,
      });
      await saveScore(this.state.game);
      let newScores = [...this.state.game.scoreEntries]; 
      newScores.forEach(scoreEntry => {
        scoreEntry.updated = false;
        scoreEntry.new = false;
      })
      this.setState({
        isSaving: false,
        showSuccessBar: true,
        game: {
          ...this.state.game,
          scoreEntries: newScores
        }
      });
    }
  }

  private finishGame() {
    if(this.state.game) {
      let newGame = this.state.game;
      newGame.isFinished = true;
      updateGame(newGame)
      this.props.history.push(`/game/${this.state.gameId}/1`)
    }
  }

  public render() {
    const changePage = async (nextPage: number) => {
       this.props.history.push(`/game/${this.state.gameId}/${nextPage}`)
    };

    if (!this.state.game) {
      return null;
    }
    let game = this.state.game;

    if (game.isFinished) {
      return (
        <div>
          <h2>{game.field.name}</h2>
          <ScoreTable game={game} />
        </div>
      );
    }

    return (
      <div>
        <GameMenu onArchiveGame={() => {this.finishGame()}} />
        <h2>{game.field.name} - Hole Number {this.state.currentHole}</h2>
        <HoleView
          players={game.players}
          holeNumber={this.state.currentHole}
          scoreEntries={game.scoreEntries.filter(scoreEntry => scoreEntry.hole === this.state.currentHole)}
          updateScoreEntry={(playerId, newScore) =>
            this.updateScoreEntry(
              playerId,
              this.state.currentHole ?? 0,
              newScore
            )
          }
        />
        <Button
          disabled={!this.isDataDirty() || this.state.isSaving}
          type="submit"
          startIcon={<Save />}
          className="standings-button"
          variant="contained"
          color="primary"
          size="large"
          onClick={() => this.onSave()}
        >
          Save scores
        </Button>
        <Button
          startIcon={<EmojiEventsIcon />}
          className="standings-button"
          variant="contained"
          color="primary"
          size="large"
          onClick={() => this.toggleShowStandings()}
        >
          View Standings
        </Button>
        <ScoreDialog
          isOpen={!!this.state.showStandings}
          handleClose={() => this.toggleShowStandings()}
          players={game.players}
          scoreEntries={game.scoreEntries}
        />
        <Snackbar
          open={!!this.state.showSuccessBar}
          autoHideDuration={6000}
          onClose={() => {
            this.setState({ showSuccessBar: false });
          }}
        >
          <Alert
            onClose={() => {
              this.setState({ showSuccessBar: false });
            }}
            severity="success"
          >
            The scores were saved!
          </Alert>
        </Snackbar>
        <Grid container direction="row" justify="center" alignItems="center">
          <Pagination
            page={this.state.currentHole}
            onChange={(_, nextPage) => changePage(nextPage)}
            count={this.state.numberOfHoles ?? 1}
            color="primary"
          />
        </Grid>
      </div>
    );
  }
}

export default withRouter(GameController);
