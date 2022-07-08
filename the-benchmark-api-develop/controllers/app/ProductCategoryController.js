import ProductCategory from "../../models/app/productCategory.js";
import vendorProduct from "../../models/app/vendorProduct.js";
import Slugify from "slugify";
class ProductCategoryController {
  async read(req, res, next) {
    try {
      let { searchText = "", page = 1, size=100000, headers = true } = req.query;
      console.log("headr: ", headers)
      const fetchQuery = {};
      if (searchText.trim())
        fetchQuery.name = { $regex: searchText.trim(), $options: "ig" };
      if(headers !== true)
      {
        fetchQuery.slug = {$ne: "headers"}
      }
      await ProductCategory.find(fetchQuery).sort("createdAt").exec((err, productCategories) => {
        if (err) return res.status(500).send(err);
        if (productCategories) {
          const productCategoryList = createCategories(productCategories, null, page, size);
          res.status(200).send(productCategoryList);
        }
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send(error.message);
    }
  }
  async readAll(req, res, next) {
    try {
      res.status(200).send(await ProductCategory.find());
    } catch (error) {
      console.log(error.message);
      return res.status(500).send(error.message);
    }
  }

  async create(req, res, next) {
    const { name, parentId, image } = req.body;
    if (!name) return res.status(400).send("Name missing");
    let productCategoryObj;
    if(parentId)
    {
      productCategoryObj = name.map(categoryName=>{
        let eachCategory = {
          name: categoryName,
          parentId: parentId,
          slug: Slugify(categoryName, {
            lower: true,
          })
        }
        return eachCategory
      })
    } 
    else
    {
      productCategoryObj = {
        name: name,
        image: image,
        slug: Slugify(name, {
          lower: true,
        }
        ),
      };
    }
    try {
      let productCategory;
      if(parentId)
      {
        productCategory = await ProductCategory.insertMany(productCategoryObj)
      } else{
        productCategory = await ProductCategory.create(productCategoryObj);
      }
      res.send({ productCategory });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }
  async update(req, res, next) {
    const { id } = req.params;
    try {
      await ProductCategory.updateOne({ _id: id }, req.body);
      res.send({ resp: await ProductCategory.findOne({ _id: id }) });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }

  async delete(req, res, next) {
    console.log(req.params);
    const { id } = req.params;
    if (!id) return res.status(400).send("ID missing");
    const productCategory = await ProductCategory.findOne({ _id: id });
    const subCategory = await ProductCategory.find({parentId: id})
    const subCategoryId = subCategory.map(p=>{
      return p._id
    }) 
    console.log(subCategoryId)
    if (!productCategory) return res.status(400).send("Category not found");
    try {
      await ProductCategory.deleteOne({ _id: id });
      await ProductCategory.deleteMany({parentId: id});
      await vendorProduct.deleteMany({productCategory: id})
      await vendorProduct.deleteMany({productCategory: subCategoryId })
      return res.send({ productCategory: productCategory._id });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }
}

export default ProductCategoryController;

function createCategories(productCategories, parentId = null, page = 1, size = 100000) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = productCategories.filter((cat) => cat.parentId == undefined);
  } else {
    category = productCategories.filter((cat) => cat.parentId == parentId);
  }
  var start = (page * size) - (size - 1)
  var end = page * size
  var i = 0
  for (let cate of category) {
    i+=1
    if(i>=start && i <= end)
    {
      categoryList.push({
        _id: cate._id,
        name: cate.name,
        slug: cate.slug,
        image: cate.image,
        children: createCategories(productCategories, cate._id),
      });
    }
  }
  return {productCategoryList: categoryList, count: i};
}
