import express from "express";
import { urlModel } from "../model/shortUrl.model";

export const createUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    console.log("The full URL is: ", req.body.fullUrl);
    const { fullUrl } = req.body;
    const urlFound = await urlModel.find({ fullUrl });
    if (urlFound.length > 0) {
      res.status(409).send(urlFound);
    } else {
      const shortUrl = await urlModel.create({ fullUrl });
      res.status(201).send(shortUrl);
    }
  } catch (error) {
    res.status(500).send({ message: "Something on 'create' went wrong" });
  }
};

export const getAllUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const shortlUrls = await urlModel.find().sort({ createdAt: -1 });
    if (shortlUrls.length < 0) {
      res.status(404).send({ message: "ShortUrl is not Found!" });
    } else {
      res.status(200).send(shortlUrls);
    }
  } catch (error) {
    res.status(500).send({ message: "Something went wrong" });
  }
};

export const getSingleUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const shortUrl = await urlModel.findOne({ shortUrl: req.params.id });
    if (!shortUrl) {
      res.status(404).send({ message: "Full Url not found" });
    } else {
      //   res.status(201).send(`${shortlUrl.fullUrl}`);
      shortUrl.clicks++;
      shortUrl.save();
      res.redirect(`${shortUrl.fullUrl}`);
    }
  } catch (error) {
    res.status(500).send({ message: "Something went wrong" });
  }
};

export const deleteUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const shortlurl = await urlModel.findByIdAndDelete({
      _id: req.params.id,
    });
    if (shortlurl) {
      res.status(200).send({ message: "URL deleted successfully!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Something went wrong" });
  }
};
