import React, { useState } from "react";
import axios from 'axios';
import { useLocation } from 'react-router';
import { useNavigate } from "react-router-dom";

const CourseEdit = ({ auth, courses }) => {
    const location = useLocation();
    const id = location.pathname.split('/')[3];
    const course = courses && courses.find(f => f._id === id);

    const [file, setFile] = useState(null);
    const [name, setName] = useState(course && course.name);
    const [grade, setGrade] = useState(course && course.grade);
    const [link, setLink] = useState(course && course.link);
    const [content, setContent] = useState(course && course.content)
    const [level, setLevel] = useState(course && course.level);
    const [uploaded, setUploaded] = useState(null);
    const navigate = useNavigate();

    const HandleFileChange = (e) => {
        setFile(e.target.files[0]);
        const f = e.target.files[0]
        setUploaded(URL.createObjectURL(f));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("file", file);

        const values = {
            "name": name,
            "grade": grade,
            "content": content,
            "img": file && file.name ? file.name : course.img,
            "link": link,
            "level": level
        }

        if (file !== null) {
            axios.post(process.env.REACT_APP_SERVER_URL + "file/upload", data)
                .then(res => { console.log(res.data) })
                .catch(err => console.log(err))

            axios.delete(process.env.REACT_APP_SERVER_URL + `file/remove/${course.img}`)
                .then(res => { console.log(res.data) })
                .catch(err => console.log(err))
        }

        axios.put(process.env.REACT_APP_SERVER_URL + `courses/${id}`, values)
            .then(res => {
                if (res.status === 200) {
                    alert("Cập nhật thành công!");
                    navigate('/admin/4', { replace: true });
                }
            })
            .catch(err => console.log(err))

    }

    return (
        auth && auth.permission === "admin" && course &&
        <div className="lg:mx-80 mx-24 pt-10">
            <div className="sm:text-2xl text-lg text-teal-400 sm:font-bold font-semibold mb-6 text-center">
                Cập nhật khóa học
            </div>
            <form className="shadow bg-gray-800 rounded-lg p-3" onSubmit={handleSubmit}>
                <div className="flex justify-evenly mb-6 text-base">
                    <span className="text-slate-400">Tải hình ảnh lên </span>
                    <input className="ml-4 rounded-lg bg-emerald-400" type="file" name="file"
                        onChange={HandleFileChange} />
                    {uploaded? <img className="w-10 h-10 rounded-full" src={uploaded} alt={course.name} />
                        : <img className="w-10 h-10 rounded-full" src={process.env.REACT_APP_SERVER_URL + course.img} alt={course.name} />}
                </div>
                <div className="mb-6">
                    <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-slate-400 ">
                        Tên khóa học
                    </label>
                    <input type="text" id="name"
                        className="bg-slate-700 border  text-white 
                                text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        defaultValue={course.name}
                        onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-6">
                    <label
                        htmlFor="grade"
                        className="block mb-2 text-sm font-medium text-slate-400 ">
                        Lớp
                    </label>
                    <input
                        type="text"
                        id="grade"
                        className="bg-slate-700 border  text-white text-sm rounded-lg
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        defaultValue={course.grade}
                        onChange={(e) => setGrade(e.target.value)} />
                </div>
                <div className="mb-6">
                    <label
                        htmlFor="link"
                        className="block mb-2 text-sm font-medium text-slate-400 ">
                        Đường dẫn
                    </label>
                    <input
                        type="text"
                        id="link"
                        className="bg-slate-700 border  text-white text-sm rounded-lg
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        defaultValue={course.link}
                        onChange={(e) => setLink(e.target.value)} />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="content"
                        className="block mb-2 text-sm font-medium text-slate-400 ">
                        Nội dung
                    </label>
                    <textarea
                        id="content"
                        className="bg-slate-700 border  text-white text-sm rounded-lg
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        defaultValue={course.content}
                        onChange={(e) => setContent(e.target.value)} />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="level"
                        className="block mb-2 text-sm font-medium text-slate-400 ">
                        Độ khó
                    </label>
                    <div className="flex" id="level">
                        <div className="flex items-center me-4">
                            <input id="inline-radio" type="radio" name="inline-radio-group"
                                className="w-4 h-4 text-blue-600 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
                                defaultChecked={course.level === 'easy'}
                                onClick={() => setLevel("easy")} />
                            <label htmlFor="inline-radio" className="ms-2 text-sm font-medium  text-gray-300">Dễ</label>
                        </div>
                        <div className="flex items-center me-4">
                            <input id="inline-2-radio" type="radio" name="inline-radio-group"
                                className="w-4 h-4 text-blue-600 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
                                defaultChecked={course.level === 'medium'}
                                onClick={() => setLevel("medium")} />
                            <label htmlFor="inline-2-radio" className="ms-2 text-sm font-medium  text-gray-300">Trung bình</label>
                        </div>
                        <div className="flex items-center me-4">
                            <input id="inline-checked-radio" type="radio" name="inline-radio-group"
                                className="w-4 h-4 text-blue-600 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
                                defaultChecked={course.level === 'hard'}
                                onClick={() => setLevel("hard")} />
                            <label htmlFor="inline-checked-radio" className="ms-2 text-sm font-medium  text-gray-300">Khó</label>
                        </div>
                        <div className="flex items-center me-4">
                            <input id="inline-checked-radio" type="radio" name="inline-radio-group"
                                className="w-4 h-4 text-blue-600 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
                                defaultChecked={course.level === 'so hard'}
                                onClick={() => setLevel("so hard")} />
                            <label htmlFor="inline-checked-radio" className="ms-2 text-sm font-medium  text-gray-300">Rất khó</label>
                        </div>
                    </div>

                </div>

                <button type="submit" className="text-white bg-green-400 hover:bg-green-600 
                        focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
                        text-sm w-full sm:w-auto px-5 py-2.5 text-center ">
                    Cập nhật
                </button>
            </form>

        </div>
    )
}

export default CourseEdit;