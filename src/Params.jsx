import React from "react";
import { Formik } from "formik";

export default function Params() {
  return (
    <>
      <div>
        <h1>Params</h1>
        <Formik
          initialValues={{ pos_x: 2, pos_y: 3 }}
          validate={(values) => {
            const errors = {};
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              const str = new URLSearchParams(values).toString().replaceAll("_", ".");
              alert(str);
              setSubmitting(false);
            }, 400);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <fieldset>
                <legend>Parameters</legend>
                <label>
                  pos-x
                  <input
                    type="number"
                    name="pos_x"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.pos_x}
                  />
                  {errors.pos_x && touched.pos_x && errors.pos_x}
                </label>
                <br />
                <label>
                  pos-y
                  <input
                    type="number"
                    name="pos_y"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.pos_y}
                  />
                  {errors.pos_y && touched.pos_y && errors.pos_y}
                </label>
                <br />

                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </fieldset>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
}
