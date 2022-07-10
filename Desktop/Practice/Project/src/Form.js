
import React from 'react'
import './Form.css'
const Form = () => {
    return (
      <div>
        <form>
          <div className={styles.flex}>
            <div>
              <label className={styles.label}>Name</label>
              <input className={styles.form_control} type="text" name="name" />
            </div>
            <div className="flex_1">
              <label className={styles.label}>Email</label>
              <input className={styles.form_control} type="email" name="email" />
            </div>
            <div className="flex_1">
              <label className={styles.label}>Phone</label>
              <input className={styles.form_control} type="text" name="phone" />
            </div>
          </div>
        </form>
      </div>
    );
  };
  
  export default Form;