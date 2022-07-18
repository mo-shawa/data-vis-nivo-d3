import React from 'react'
import Select from 'react-select';


export const Top = (props) => {

    const styles = {

        valueContainer: (base) => ({
            ...base,
            flexWrap: 'nowrap',
        }),

        menuList: base => ({
            ...base,
            "::-webkit-scrollbar": {
                width: "0.5rem",
            },

            "::-webkit-scrollbar-thumb": {
                background: "gray",
                borderRadius: "1rem"
            },
            "::-webkit-scrollbar-thumb:hover": {
                background: "#555"
            }
        })

    }

    return (
        <div className='top'>
            <h2>Photos Per Person</h2>
            <div className="select-wrapper">
                <small>FILTER OUT</small>
                <Select
                    className='select'
                    isMulti
                    options={props.keys.map((key, idx) => ({ value: idx, label: key }))}
                    onChange={props.handleChange}
                    styles={styles}
                />
            </div>
        </div>
    )
}
