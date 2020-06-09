import * as React from "react";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import usePagination from "@material-ui/lab/Pagination/usePagination";
import Field from "types/Field";
import makeStyles from "@material-ui/core/styles/makeStyles";

export interface HoleNavigationProps {
  currentHole: number;
  count: number;
  disabled: boolean;
  field: Field;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}
const buttonSize = "36px";
const useStyles = makeStyles({
  ul: {
    listStyle: "none",
    margin: 0,
    display: "flex",
    padding: 0,
    alignItems: "center",
  },
  item: {
    borderRadius: "4px",
    margin: "0 3px",
    height: buttonSize,
    fontSize: "0.9375rem",
    minWidth: buttonSize,
    maxWidth: buttonSize,
    border: "1px solid rgba(0, 0, 0, 0.23)",
    backgroundColor: "transparent",
    position: "relative",
    textAlign: "center",
    fontWeight: "normal",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    outline: "0",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      cursor: "pointer",
    },
    transition:
      "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  saved: {
    backgroundColor: "rgb(76,175,80, 0.12)"
  },
  selectedItem: {
    color: "#3f51b5",
    border: "1px solid gba(63, 81, 181, 0.5)",
    backgroundColor: "rgba(63, 81, 181, 0.12)",
  },
  disabled: {
    opacity: "0.38",
    "&:hover": {
      cursor: "default",
    },
  },
  ellipsis: {
    height: "auto",
    fontSize: "0.9375rem",
    minWidth: buttonSize,
    maxWidth: buttonSize,
    borderRadius: "20px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 3px"
  }
});

const HoleNavigation: React.FC<HoleNavigationProps> = ({
  currentHole,
  count,
  onChange,
  disabled,
  field
}) => {
  const { items } = usePagination({
    count,
    onChange,
    disabled,
    page: currentHole,
    siblingCount:1,
  });
  const classes = useStyles();
  return (
    <nav>
      <ul className={classes.ul}>
        {items.map(({ page, type, selected, ...item }, index) => {
          let children;
          if (type === "start-ellipsis" || type === "end-ellipsis") {
            children = (
              <div className={`${classes.ellipsis}`}>
                …
              </div>
            );
          } else if (type === "page") {
            const selectedType = selected ? classes.selectedItem : "";
            const savedType = field.holes[page-1].isPlayed ? classes.saved : "";
            children = (
              <button
                className={`${classes.item} ${selectedType} ${savedType}`}
                type="button"
                style={{ fontWeight: selected ? "bold" : undefined }}
                {...item}
              >
                {page}
              </button>
            );
          } else if (type === "previous") {
            const disabledClass = currentHole === 1 ? classes.disabled : "";
            children = (
              <button
                className={`${classes.item} ${disabledClass}`}
                {...item}
                type="button"
              >
                <ChevronLeft />
              </button>
            );
          } else if (type === "next") {
            const disabledClass = currentHole === count ? classes.disabled : "";
            children = (
              <button
                className={`${classes.item} ${disabledClass}`}
                {...item}
                type="button"
              >
                <ChevronRight />
              </button>
            );
          } else {
            children = (
              <button
                type="button"
                {...item}
                onClick={(e) => onChange(e, currentHole)}
              >
                {type}
              </button>
            );
          }
          return <li key={index}>{children}</li>;
        })}
      </ul>
    </nav>
  );
};

export default HoleNavigation;
