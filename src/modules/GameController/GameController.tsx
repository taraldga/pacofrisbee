import * as React from "react";

import "./GameController.css";

import { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router-dom";

import HoleView from "components/HoleView/HoleView";
import { fetchGame, saveScore, updateGame } from "data/FrisbeegolfData";
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
import HoleNavigation from "components/HoleNavigation/HoleNavigation";
import { ScoreEntry } from "types/ScoreEntry";
import Field from "types/Field";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export interface GameControllerState {
  gameId: string;
  currentHole: number;
  numberOfHoles?: number;
  isSaving?: boolean;
  showStandings?: boolean;
  showSuccessBar?: boolean;
  game?: GameData;
  currentScoreEntries?: ScoreEntry[];
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

  public componentDidUpdate(
    prevProps: GameControllerProps,
    prevState: GameControllerState
  ) {
    const { gameId, holeId } = this.props.match.params;
    if (
      this.state.gameId !== this.props.match.params.gameId ||
      this.state.currentHole !== +this.props.match.params.holeId
    ) {
      this.setState({
        gameId: gameId,
        currentHole: +holeId,
      });
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
    let currentScores = currentGame.scoreEntries.filter(
      (scoreEntry) => scoreEntry.hole === currentHole
    );
    if (currentScores.length === 0) {
      currentScores = createInitialScoreEntries(
        currentGame.field,
        currentHole,
        currentGame.players,
        gameId
      );
    }
    this.setState({
      game: currentGame,
      numberOfHoles: currentGame.field.holes.length,
      currentScoreEntries: currentScores,
    });
  }

  /**
   * Update a scoreentry
   * @param scoreEntry The scoreentry to update
   * @param newScore The new score to set on the updated scoreenry
   */
  private updateScoreEntry(playerId: string, hole: number, newScore: number) {
    if (!this.state.game || !this.state.currentScoreEntries) {
      return;
    }

    const updatedScoreEntries = [...this.state.currentScoreEntries];
    let scoreToUpdate = updatedScoreEntries.findIndex(
      (entry) => entry.playerId === playerId && entry.hole === hole
    );
    if (scoreToUpdate > -1) {
      updatedScoreEntries[scoreToUpdate].score = newScore;
      updatedScoreEntries[scoreToUpdate].updated = true;
      this.setState({
        currentScoreEntries: updatedScoreEntries,
      });
    }
  }

  private isDataDirty = () => {
    if (this.state.currentScoreEntries) {
      return this.state.currentScoreEntries
        .filter((entry) => entry.hole === this.state.currentHole)
        .some((scoreEntry) => scoreEntry.new || scoreEntry.updated);
    }
    return false;
  };

  private isPaginationDisabled = () => {
    if (this.state.isSaving) return true;
    if (this.state.currentScoreEntries) {
      return this.state.currentScoreEntries
        .filter((entry) => entry.hole === this.state.currentHole)
        .some((scoreEntry) => scoreEntry.updated);
    }
    return false;
  };

  private toggleShowStandings() {
    this.setState({
      showStandings: !this.state.showStandings,
    });
  }

  private markHoleAsSaved(field: Field, holeNumber: number) {
    const updatedHoles = [...field.holes];
    updatedHoles[holeNumber - 1].isPlayed = true;
    return {
      ...field,
      holes: updatedHoles,
    };
  }

  private async onSave() {
    if (this.state.game && this.state.currentScoreEntries) {
      this.setState({
        isSaving: true,
      });
      const oldScoresToSave = this.state.game.scoreEntries.filter(
        (scoreEntry) => scoreEntry.hole !== this.state.currentHole
      );
      let newScores = [
        ...oldScoresToSave,
        ...this.state.currentScoreEntries,
      ];
      newScores.forEach((scoreEntry) => {
        if (scoreEntry.hole === this.state.currentHole) {
          scoreEntry.updated = false;
          scoreEntry.new = false;
        }
      });
      const updatedField = this.markHoleAsSaved(
        this.state.game.field,
        this.state.currentHole
      );
      const newGame: GameData = {
        ...this.state.game,
        scoreEntries: newScores,
        field: updatedField,
      };
      await saveScore(newGame);
      this.setState({
        isSaving: false,
        showSuccessBar: true,
        game: newGame,
      });
    }
  }

  private finishGame() {
    if (this.state.game) {
      let newGame = this.state.game;
      newGame.isFinished = true;
      updateGame(newGame);
      this.props.history.push(`/game/${this.state.gameId}/1`);
    }
  }

  public render() {
    const changePage = async (nextPage: number) => {
      this.props.history.push(`/game/${this.state.gameId}/${nextPage}`);
    };

    if (!this.state.game || !this.state.currentScoreEntries) {
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
        <GameMenu
          onArchiveGame={() => {
            this.finishGame();
          }}
        />
        <h2>
          {game.field.name} - Hole Number {this.state.currentHole}
        </h2>
        <HoleView
          players={game.players}
          holeNumber={this.state.currentHole}
          scoreEntries={this.state.currentScoreEntries}
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
          <HoleNavigation
            onChange={(_, nextPage) => changePage(nextPage)}
            disabled={this.isPaginationDisabled()}
            count={this.state.numberOfHoles ?? 1}
            field={game.field}
            currentHole={this.state.currentHole}
          />
        </Grid>
      </div>
    );
  }
}

export default withRouter(GameController);
