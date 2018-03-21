const newLink = {
  subscribe: (parent, args, context, info) => {
    return context.db.subscription.link({}, info);
  }
};

const newVote = {
  subscribe: (parent, args, ctx, info) => {
    return ctx.db.subscription.vote(
      { where: { mutation_in: ['CREATED'] } },
      info
    );
  }
};

module.exports = {
  newLink,
  newVote
};
