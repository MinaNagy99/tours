export class ApiFeature {
  constructor(mongoseQuery, queryString) {
    (this.mongoseQuery = mongoseQuery), (this.queryString = queryString);
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    if (page <= 0) {
      page = 1;
    }
    this.page = page;
    const skip = (page - 1) * 20;
    this.mongoseQuery.skip(skip).limit(20);
    return this;
  }

  filter() {
    let filterobj = { ...this.queryString };
    const excludeQuary = ["page", "sort", "fields", "keyword"];
    excludeQuary.forEach((q) => {
      delete filterobj[q];
    });
    filterobj = JSON.stringify(filterobj);
    filterobj = filterobj.replace(/\b(gt|gte|lt|lte)\b/g, (math) => `$${math}`);
    filterobj = JSON.parse(filterobj);
    console.log(filterobj);
    this.mongoseQuery.find(filterobj);

    return this;
  }
  sort() {
    if (this.queryString.sort) {
      let sortedBy = this.queryString.sort.split(",").join(" ");
      this.mongoseQuery.sort(sortedBy);
    }
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      this.mongoseQuery.find({
        $or: [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } }
        ]
      });
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      this.mongoseQuery.select(fields);
    }
    return this;
  }
}
