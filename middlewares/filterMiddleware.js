const createFilterObj = ({ postParam = false, userField = false, authorField = false }) => {
  return (req, res, next) => {
    const filterObject = {};

    if (postParam && req.params.postId) {
      filterObject["post"] = req.params.postId;
    }

    if (userField && req.user?._id) {
      filterObject["user"] = req.user._id.toString();
    }

    if (authorField && req.user?._id) {
      filterObject["author"] = req.user._id.toString();
    }

    req.filterObj = filterObject;
    next();
  };
};

export default createFilterObj;
