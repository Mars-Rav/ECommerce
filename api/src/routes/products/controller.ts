import { Request, Response } from "express";

export function list(req: Request, res: Response) {
  res.send(`Listing products...`);
}

export function details(req: Request, res: Response) {
  res.send(`Displaying details of product#${req.params.id}`);
}

export function create(req: Request, res: Response) {
  console.log(req.body);

  res.send(
    `Creating a new product with the following data: ${req.body.name} ${req.body.price}`
  );
}

export function remove(req: Request, res: Response) {
  res.send(`Removing product#${req.params.id}`);
}

export function update(req: Request, res: Response) {
  res.send(`Updating product#${req.params.id}`);
}
