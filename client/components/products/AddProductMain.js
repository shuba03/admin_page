import React from "react";
import { Link } from "react-router-dom";
// import FormData from "form-data";
import axios from "axios";

class AddProductMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async handleSubmit(event) {
    event.preventDefault();
    const form = new FormData();
    for (const item in this.state) {
      if (item === "image") {
        form.append(item, this.state[item].data, { filename: this.state[item].name });
        continue;
      }
      form.append(item, this.state[item]);
    }

    const server = window.location.origin;

    try {
      await axios.post(`${server}/api/add-product`, form);
      this.setState({});
    } catch (err) {
      console.error("Upload failed", err);
    }
  }

  async handleChange(event) {
    const field = event.target.name;
    let value = event.target.value;

    if (field === "image" && event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const buffer = await file.arrayBuffer();
      const blob = new Blob([new Uint8Array(buffer)], { type: file.type });
      value = {
        data: blob,
        name: event.target.files[0].name
      };
    }

    const data = { ...this.state, [field]: value };
    this.setState(data)
  }

  render() {
    return (
      <>
        <section className="content-main" style={{ maxWidth: "1200px" }}>
          <form onSubmit={this.handleSubmit.bind(this)} encType="multipart/form-data">
            <div className="content-header">
              <Link to="/products" className="btn btn-danger text-white">
                Go to products
              </Link>
              <h2 className="content-title">Add product</h2>
              <div>
                <button type="submit" className="btn btn-dark">
                  Publish now
                </button>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-xl-8 col-lg-8">
                <div className="card mb-4 shadow-sm">
                  <div className="card-body">
                    <div className="mb-4">
                      <label htmlFor="product_id" className="form-label">
                        Product Title
                      </label>
                      <input
                        type="text"
                        placeholder="Type here ..."
                        className="form-control"
                        id="product_id"
                        name="title"
                        onBlur={this.handleChange.bind(this)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="product_title" className="form-label">
                        Product Brand
                      </label>
                      <input
                        type="text"
                        placeholder="Type here ..."
                        className="form-control"
                        id="product_title"
                        name="brand"
                        onBlur={this.handleChange.bind(this)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="product_title" className="form-label">
                        Product Color
                      </label>
                      <input
                        type="text"
                        placeholder="Type here ..."
                        className="form-control"
                        id="product_title"
                        name="color"
                        onBlur={this.handleChange.bind(this)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="product_price" className="form-label">
                        Price
                      </label>
                      <input
                        type="number"
                        placeholder="Type here ..."
                        className="form-control"
                        id="product_price"
                        name="price"
                        onBlur={this.handleChange.bind(this)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="product_price" className="form-label">
                        Count In Stock
                      </label>
                      <input
                        type="number"
                        placeholder="Type here ..."
                        className="form-control"
                        id="product_price"
                        name="countInStock"
                        onBlur={this.handleChange.bind(this)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Image</label>
                      <input className="form-control mt-3" type="file"
                        name="image"
                        onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Description</label>
                      <textarea
                        placeholder="Type here"
                        className="form-control"
                        rows="5"
                        name="description"
                        onBlur={this.handleChange.bind(this)}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
      </>
    );
  }
}


export default AddProductMain;
