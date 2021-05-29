import {
  createBrowserHistory,
  Location,
  Action,
  LocationDescriptorObject,
  LocationState,
  Path,
} from 'history';

export const browserHistory = createBrowserHistory();

const pastLocations: Location[] = [];

function updatePastLocations(location: Location, action: Action) {
  switch (action) {
    case 'PUSH':
      // first location when app loads and when pushing onto history
      this.pastLocations.push(location);
      break;
    case 'REPLACE':
      // only when using history.replace
      this.pastLocations[this.pastLocations.length - 1] = location;
      break;
    case 'POP': {
      // happens when using the back button, or forward button
      this.pastLocations.pop();
      // location according to pastLocations
      const appLocation = this.pastLocations[this.pastLocations.length - 1];
      if (!(appLocation && appLocation.key === location.key)) {
        // If the current location doesn't match what the app thinks is the current location,
        // blow up the app history.
        this.pastLocations = [location];
      }
      break;
    }
    default:
  }
}

browserHistory.listen(updatePastLocations);

function isPreviousLocationWithinApp(): boolean {
  return pastLocations.length > 1;
}

export function goBackOrReplace(
  location: Path | LocationDescriptorObject,
  state?: LocationState
): void {
  if (isPreviousLocationWithinApp()) {
    browserHistory.goBack();
  } else {
    browserHistory.replace(location as any, state);
  }
}
