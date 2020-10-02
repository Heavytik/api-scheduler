const schedule = (sequelize, DataTypes) => {
  const Schedule = sequelize.define("schedule", {
    name: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Schedule.associate = (models) => {
    Schedule.hasMany(models.Event, { onDelete: "CASCADE" });
  };

  return Schedule;
};

export default schedule;
