import mongoose from "mongoose";
import VendorProduct from "../../models/app/vendorProduct.js";
import ProductCategory from "../../models/app/productCategory.js";

class VendorProductController {
  async read(req, res, next) {
    try {
      var vendorProducts = await VendorProduct.find({})
      .sort("-createdAt")
      .populate("productCategory")
      var products = vendorProducts.map(async p=>{
        if(p.productCategory?.parentId)
        {
          return {
            _id: p._id,
            name: p.name,
            images: p.images,
            videos: p.videos,
            description: p.description,
            price: p.price,
            subCategory: p.productCategory,
            productCategory: await ProductCategory.find({_id:  mongoose.Types.ObjectId(p.productCategory?.parentId)})
          }
        } else{
          return {
            _id: p._id,
            name: p.name,
            images: p.images,
            videos: p.videos,
            description: p.description,
            price: p.price,
            productCategory: [p.productCategory]            
          }
        }
      })
      const results = await Promise.all(products);
      res.send({
        vendorProducts: results,
        total: await VendorProduct.count({}),
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send(error.message);
    }
  }

  async adminRead(req, res, next) {
    const { adminProfile } = req;
    if (!adminProfile) return res.status(404).send("Forbidden");
    try {
      let { page = 1, size = 10, status = "", searchText = "" } = req.query;

      const limit = parseInt(size);
      const skip = (page - 1) * size;

      const fetchQuery = {};
      if (searchText.trim())
        fetchQuery.name = { $regex: searchText.trim(), $options: "ig" };
      console.log(fetchQuery);
      const vendorProducts = await VendorProduct.find(fetchQuery)
          .sort("-createdAt")
          .skip(skip)
          .limit(limit)
          .populate("productCategory")
      var products = vendorProducts.map(async p=>{
        if(p.productCategory?.parentId)
        {
          return {
            _id: p._id,
            name: p.name,
            images: p.images,
            videos: p.videos,
            description: p.description,
            price: p.price,
            subCategory: p.productCategory,
            productCategory: await ProductCategory.find({_id:  mongoose.Types.ObjectId(p.productCategory?.parentId)})
          }
        } else{
          return {
            _id: p._id,
            name: p.name,
            images: p.images,
            videos: p.videos,
            description: p.description,
            price: p.price,
            productCategory: [p.productCategory]            
          }
        }
      })
      const results = await Promise.all(products);
      res.send({
        vendorProducts: results,
        total: await VendorProduct.count(fetchQuery),
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send(error.message);
    }
  }

  async find(req, res, next) {
    console.log("req.params");
    console.log(req.params);
    const { id } = req.params;
    if (!id) return res.status(400).send("ID missing");
    const vendorProduct = await VendorProduct.aggregate([
      {
        $match:{
          _id: mongoose.Types.ObjectId(id)
        }
      },
      {
        $lookup:{
          from: "vendorprofiles",
          localField: "vendor",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "productCategory",
          foreignField: "_id",
          as: "productCategory"
        }
      },      
      {
        $lookup: {
          from: "productcategories",
          let: {pid: "$draft.productCategory"},
          pipeline: [
            {
              $match: {
                $expr:{
                  $eq:[
                    "$_id",
                    {$toObjectId: "$$pid"}
                  ]
                }
              }
            }
          ],
          as: "draft.productCategory"
        }
      },
      {
        $addFields:{
          vendor:{
            $arrayElemAt: [
            "$vendor",
            0]
          },
          productCategory: {
            $arrayElemAt: [
              "$productCategory",
              0
            ]
          },
          "draft.productCategory":{
            $arrayElemAt:[
              "$draft.productCategory",
              0
            ]
          }
        }
      },
      {
        $sort:{
          updatedAt: -1
        }
      }
    ])
    if (!vendorProduct) return res.status(400).send("VendorProduct not found");
    try {
      res.send({ vendorProduct });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send(error.message);
    }
  }

  async findVarients(req, res, next) {
    console.log("req.params findVarients ");
    console.log(req.params);
    const { id } = req.params;
    if (!id) return res.status(400).send("ID missing");
    const vendorProduct = await VendorProduct.findOne({ _id: id })
      .sort("-updatedAt")
      .populate("vendor")
      .populate("productCategory");

    if (!vendorProduct) return res.status(400).send("VendorProduct not found");
    console.log("vendorProduct.isVariantOf");
    console.log(vendorProduct.isVariantOf);
    let pvId = vendorProduct.isVariantOf
      ? vendorProduct.isVariantOf
      : vendorProduct._id;
    try {
      const parentVendorProduct = await VendorProduct.findOne({ _id: pvId });
      const vendorProducts = await VendorProduct.find({ isVariantOf: pvId })
        .sort("-updatedAt")
        .populate("vendor")
        .populate("productCategory");
      res.send({
        vendorProducts: [...vendorProducts, parentVendorProduct].filter(
          (p) => p.status === 1
        ),
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send(error.message);
    }
  }

  async findVendorProductsUsingVendorId(req, res, next) {
    console.log("req.params");
    console.log(req.params);
    const { id } = req.params;
    if (!id) return res.status(400).send("ID missing");
    try {
      let { page = 1, size = 10, search } = req.query;

      const limit = parseInt(size);
      const skip = (page - 1) * size;
      let regex = new RegExp(search, "i");
      const vendorProductCount = await VendorProduct.count({
        $and: [{ vendor: id }, { name: regex }],
      });
      const vendorProduct = await VendorProduct.find({
        $and: [{ vendor: id }, { name: regex }],
      })
        .sort("-updatedAt")
        .limit(limit)
        .skip(skip)
        .populate("vendor")
        .populate("productCategory");
      return res.send({
        page,
        total: vendorProductCount,
        vendorProducts: vendorProduct,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send(error.message);
    }
  }

  async searchVendorProduct(req, res, next) {
    console.log(req.params);
    const { key, cId, tag, sort, vendor } = req.query;

    console.log("regex", Object.keys(req.query));
    try {
      const filterCondition = [];
      if (key)
        filterCondition.push({
          $match: { name: { $regex: key, $options: "i" } },
        });
      if (cId) {
        console.log(163)
        if(!mongoose.Types.ObjectId.isValid(cId)){
          return res.status(400).send("Invalid category id provided");
        }
        const productCategory = await ProductCategory.findOne({
          _id: cId,
        });
        if (!productCategory) return res.status(500).send("category not found");
        if(productCategory.parentId)
        {
          filterCondition.push({
            $match: {
              productCategory: new mongoose.Types.ObjectId(productCategory._id),
            },
          });
        } else{
          const productCategories = [{_id:cId}]
          var productCategoriesId = productCategories.map(p=>{
            return new mongoose.Types.ObjectId(p._id)
          })
          filterCondition.push({
            $match: {
              productCategory:{
                $in: productCategoriesId
              }
            }
          })
        }
      }
      if (req.query.filter_price_max)
        filterCondition.push({
          $match: { price: { $lte: parseInt(req.query.filter_price_max) } },
        });
      if (req.query.filter_price_min)
        filterCondition.push({
          $match: { price: { $gte: parseInt(req.query.filter_price_min) } },
        });
      if (req.query.filter_rating_gte)
        filterCondition.push({
          $match: {
            avgRating: { $gte: parseFloat(req.query.filter_rating_gte) },
          },
        });
      if (req.query.tag)
        filterCondition.push({ $match: { tags: { $in: [tag] } } });
      if (req.query.sort === "asc")
        filterCondition.push({ $sort: { discountedPrice: 1 } });
      if (req.query.sort === "desc")
        filterCondition.push({ $sort: { discountedPrice: -1 } });

      if (!filterCondition.length) {
        filterCondition.push({
          $match: { name: { $regex: "", $options: "i" } },
        });
      }
      console.log("filterCondition");

      filterCondition.push({
        $lookup: {
          from: "productcategories",
          localField: "productCategory",
          foreignField: "_id",
          as: "productCategory_doc",
        },
      });

      filterCondition.push({
        $lookup: {
          from: "vendorprofiles",
          localField: "vendor",
          foreignField: "_id",
          as: "vendor_doc",
        },
      });

      console.log(JSON.stringify(filterCondition));
      const productAggregator = VendorProduct.aggregate(filterCondition);
      const vendorProduct = await productAggregator.exec();
      const count = await productAggregator.count("total");

      return res.status(200).send({
        total: count.length > 0 ? count[0].total : 0,
        vendorProduct,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send(error.message);
    }
  }

  async create(req, res, next) {
    const { adminProfile } = req;
    if (!adminProfile) return res.status(404).send("Forbidden");
    const {
      productCategory,
      name,
      images,
      videos,
      description,
      price
    } = req.body;
    console.log("<=========================START=========================>");
    console.log(req.body);
    console.log("<==========================END==========================>");
    if (!productCategory)
      return res.status(400).send("Product Category Id missing");
    if (!name) return res.status(400).send("Name missing");
    if (!images) return res.status(400).send("Images missing");
    if (!description) return res.status(400).send("Description missing");
    if (!price) return res.status(400).send("Price missing");
    try {
      const vendorProductPayload = {
        productCategory,
        name,
        images,
        videos,
        description,
        price
      };

      const resp = await VendorProduct.create(vendorProductPayload);
      return res.status(200).send({ resp });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    if (!id) return res.status(400).send("ID missing");
    const vendorProduct = await VendorProduct.findOne({ _id: id });
    if (!vendorProduct) return res.status(400).send("VendorProduct not found");
    try {     
        await VendorProduct.updateOne({ _id: id }, req.body);
        return res.status(200).send({
        vendorProduct: await VendorProduct.findOne({ _id: id }),
        });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }

  async edit(req, res, next) {
    const { adminProfile } = req;
    const { id } = req.params;
    if (!id) return res.status(400).send("ID missing");
    if (!adminProfile) return res.status(400).send("Forbidden");
    const vendorProduct = await VendorProduct.findOne({ _id: id });
    if (!vendorProduct) return res.status(400).send("VendorProduct not found");
    try {
        await VendorProduct.updateOne({ _id: id }, req.body);
        return res.status(200).send({
            vendorProduct: await VendorProduct.findOne({ _id: id }),
        });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }

  async delete(req, res, next) {
    console.log(req.params);
    const { id } = req.params;
    if (!id) return res.status(400).send("ID missing");
    const vendorProduct = await VendorProduct.findOne({ _id: id });
    if (!vendorProduct) return res.status(400).send("VendorProduct not found");
    try {
      await VendorProduct.deleteOne({ _id: id });
      res.send({ vendorProduct: vendorProduct._id });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }
}
export default VendorProductController;
