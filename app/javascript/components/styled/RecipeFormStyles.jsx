export default {
  container: {
    display: 'grid',
    gridTemplateColumns: '20px 100px 20% 50px 40px',
    gridTemplateRows: '20% 20% 20% 20% auto',
    gridRowGap: '20px',
    // height: `300px`,
    height: 'auto',
  },
  nameLabel: {
    gridColumnStart: 2,
    gridColumnEnd: 3,
    gridRowStart: 1,
    gridRowEnd: 2,
    alignSelf: 'center',
  },
  nameField: {
    gridColumnStart: 3,
    gridColumnEnd: 4,
    gridRowStart: 1,
    gridRowEnd: 2,
  },
  descriptionLabel: {
    gridColumnStart: 2,
    gridColumnEnd: 3,
    gridRowStart: 2,
    gridRowEnd: 3,
    alignSelf: 'center',
  },
  descriptionField: {
    gridColumnStart: 3,
    gridColumnEnd: 4,
    gridRowStart: 2,
    gridRowEnd: 3,
  },
  instructionsLabel: {
    gridColumnStart: 2,
    gridColumnEnd: 3,
    gridRowStart: 3,
    gridRowEnd: 4,
    alignSelf: 'center',
  },
  instructionsField: {
    gridColumnStart: 3,
    gridColumnEnd: 4,
    gridRowStart: 3,
    gridRowEnd: 4,
  },
  bottomItem: {
    gridColumnStart: 3,
    gridColumnEnd: 4,
    gridRowStart: 4,
    gridRowEnd: 5,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}
