const Listing=require("./models/listings");
const Review=require("./models/reviews");
module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user)
    if (!req.isAuthenticated()) {
      req.session.redirectUrl=req.originalUrl;
      req.flash("error", "You must be logged in!!");
      return res.redirect("/login");
    }
    next();
  };
  module.exports.saveRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
      res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
  }
  module.exports.isOwner= async (req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.curruser._id)){
      req.flash("error","you are not the owner");
      return res.redirect(`/listings/${id}`);
    }
    next();
  }
  module.exports.isAuthor=async(req,res,next)=>{
    let{listingId,reviewId}=req.params;
    let review=await Review.findById(reviewId)

    if(!review.author.equals(res.locals.curruser._id)){
      req.flash("error","you are not the owner");
      console.log("Redirecting to:", `/listings/${listingId}`);
      console.log("Request Params:", req.params);

      return res.redirect(`/listings/${listingId}`);
    }
    next();
  }