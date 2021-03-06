import React, { Component } from "react";
import { fire } from "../components/firebase";
import { IconBookmarkSolid } from "../components/icons/icons";

class FavouriteButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFavourite: false,
      loading: true
    };
  }

  checkStatus = () => {
    let favouritesRef = fire
      .database()
      .ref("users/" + this.props.userUid + "/favourites");
    let activityId = this.props.activityId;

    favouritesRef.once("value", snapshot => {
      snapshot.forEach(child => {
        let favouriteActivityId = child.child("activityId").val();

        if (favouriteActivityId === activityId) {
          console.log("activity is favourited");
          this.setState({
            isFavourite: true
          });
        }
      });
      this.setState({ loading: false });
    });
  };

  unfavouriteThis = () => {
    let favouritesRef = fire
      .database()
      .ref("users/" + this.props.userUid + "/favourites");
    let activityId = this.props.activityId;

    if (this.state.isFavourite) {
      favouritesRef.once("value", snapshot => {
        snapshot.forEach(child => {
          let favouriteActivityId = child.child("activityId").val();

          if (favouriteActivityId === activityId) {
            console.log("remove from firebase");
            child.ref.remove();
          }
        });
      });

      this.setState({
        isFavourite: false
      });
    }
  };

  favouriteThis = () => {
    let favouritesRef = fire
      .database()
      .ref("users/" + this.props.userUid + "/favourites");
    let activityId = this.props.activityId;
    let newFavouriteRef = favouritesRef.push();

    if (!this.state.isFavourite) {
      console.log("add to favourites");
      newFavouriteRef.set({
        activityId: activityId,
        activityData: this.props.data
      });

      this.setState({
        isFavourite: true
      });
    }
  };

  componentDidMount() {
    this.checkStatus();
  }

  render() {
    if (this.state.loading) {
      return (
        <button
          disabled
          className="c-btn c-btn--favourite"
          onClick={this.favouriteThis}
        >
          <IconBookmarkSolid className="c-icon" /> <span>Favourite</span>
        </button>
      );
    } else {
      return (
        <div>
          {this.state.isFavourite ? (
            <button
              className="c-btn c-btn--favourite is-favourite"
              onClick={this.unfavouriteThis}
            >
              <IconBookmarkSolid className="c-icon" /> <span>Favourited</span>
            </button>
          ) : (
            <button
              className="c-btn c-btn--favourite"
              onClick={this.favouriteThis}
            >
              <IconBookmarkSolid className="c-icon" /> <span>Favourite</span>
            </button>
          )}
        </div>
      );
    }
  }
}

export default FavouriteButton;
