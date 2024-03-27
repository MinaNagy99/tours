import joi from "joi";
export const createTourSchema = joi.object({
  title: joi.string().min(3).max(100).required(),
  description: joi.string().min(10).max(2000).required(),
  mainImg: joi
    .object({
      url: joi.string(),
      public_id: joi.string()
    })
    .required(),
  images: joi.array().items(
    joi.object({
      url: joi.string(),
      public_id: joi.string()
    })
  ),
  options: joi.array().items(
    joi.object({
      name: joi.string().min(5).max(100),
      price: joi.number().min(10).max(10000)
    })
  ),
  isRepeated: joi.boolean(),
  repeatTime: joi.array().items(joi.string().min(1).max(10)).min(1),
  repeatDays: joi
    .array()
    .items(
      joi
        .string()
        .valid(
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        )
    )
    .min(1),
  dateDetails: joi.string().min(5).max(100).required(),
  location: joi
    .object({
      from: joi.string().min(1).max(50),
      to: joi.string().min(1).max(50)
    })
    .required(),
  inclusions: joi.array().items(joi.string().min(5).max(100)),
  exclusions: joi.array().items(joi.string().min(5).max(100)),
  adultPricing: joi
    .array()
    .items(
      joi.object({
        adults: joi.number().min(1).max(30),
        price: joi.number().min(1).max(10000)
      })
    )
    .min(1),
  childrenPricing: joi
    .array()
    .items(
      joi.object({
        children: joi.number().min(1).max(30),
        price: joi.number().min(1).max(10000)
      })
    )
    .min(1),
  duration: joi.string().min(2).max(20).required(),
  subtitle: joi.string().min(5).max(1000).required()
});

export const updatedTourSchema = joi.object({
  id: joi.string().hex().length(24).required(),
  title: joi.string().min(3).max(100),
  description: joi.string().min(10).max(2000),
  mainImg: joi.object({
    url: joi.string(),
    public_id: joi.string()
  }),
  images: joi.array().items(
    joi.object({
      url: joi.string(),
      public_id: joi.string()
    })
  ),
  options: joi.array().items(
    joi.object({
      name: joi.string().min(5).max(100),
      price: joi.number().min(10).max(10000)
    })
  ),
  isRepeated: joi.boolean(),
  repeatTime: joi.array().items(joi.string().min(1).max(10)),
  repeatDays: joi
    .array()
    .items(
      joi
        .string()
        .valid(
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        )
    ),
  dateDetails: joi.string().min(5).max(100),
  location: joi.object({
    from: joi.string().min(1).max(50),
    to: joi.string().min(1).max(50)
  }),
  inclusions: joi.array().items(joi.string().min(5).max(100)),
  exclusions: joi.array().items(joi.string().min(5).max(100)),
  adultPricing: joi.array().items(
    joi.object({
      adults: joi.number().min(1).max(30),
      price: joi.number().min(1).max(10000)
    })
  ),
  childrenPricing: joi.array().items(
    joi.object({
      children: joi.number().min(1).max(30),
      price: joi.number().min(1).max(10000)
    })
  ),
  duration: joi.string().min(2).max(20),
  subtitle: joi.string().min(5).max(1000)
});
