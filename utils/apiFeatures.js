class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const includeFields = ["title", "content", "author", "user"];
    includeFields.forEach((field) => {
      if(queryObj[field] !== undefined) {
        queryObj[field] = field
      }
    })

    this.mongooseQuery = this.mongooseQuery.find(queryObj);

    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      let keywordFilter = {};
      if (modelName == "posts") {
        keywordFilter = {
          $or: [
            { title: { $regex: this.queryString.keyword, $options: "i" } },
            {
              content: { $regex: this.queryString.keyword, $options: "i" },
            },
          ],
        };
      } else {
        keywordFilter = {
          $or: [
            {
              content: { $regex: this.queryString.keyword, $options: "i" },
            },
          ],
        };
      }

      this.mongooseQuery = this.mongooseQuery.find(keywordFilter);
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // Next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    // Prev page
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;

    return this;
  }
}

export default ApiFeatures;
