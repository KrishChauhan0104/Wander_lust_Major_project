const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

module.exports.newForm = (req, res) => {
    res.render("listings/new.ejs");
  }; 

module.exports.showTab = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({ 
      path: "reviews"
   })
    .populate({
      path: "owner",
    });

    if (!listing) {
      req.flash("success", "It does not Exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  };

module.exports.createTab = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
   
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  };

module.exports.editTab = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("success", "It does not Exist");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  };
  
module.exports.updateTab = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { new: true, runValidators: true }
    );
    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    };
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  };
  
module.exports.destroy = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  };  