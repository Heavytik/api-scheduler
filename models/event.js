const event = (sequelize, DataTypes) => {
  const Event = sequelize.define("event", {
    header: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  return Event;
};

export default Event;
