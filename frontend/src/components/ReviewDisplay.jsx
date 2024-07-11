import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import { Card } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";

import DeleteReviewModal from "./DeleteReviewModal";
import ReviewFilter from "./ReviewFilter";

const ReviewDisplay = ({ reviews, view }) => {
    const { enqueueSnackbar } = useSnackbar();
    const formatDate = (input) => {
        const date = new Date(input);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [minUsefulness, setMinUsefulness] = useState({
        value: 1,
        label: "1",
    });
    const [maxUsefulness, setMaxUsefulness] = useState({
        value: 5,
        label: "5",
    });
    const [minDifficulty, setMinDifficulty] = useState({
        value: 1,
        label: "1",
    });
    const [maxDifficulty, setMaxDifficulty] = useState({
        value: 5,
        label: "5",
    });
    const [minRating, setMinRating] = useState({ value: 1, label: "1" });
    const [maxRating, setMaxRating] = useState({ value: 5, label: "5" });

    const setMinUsefulnessHelper = (usefulness) => {
        if (usefulness.value <= maxUsefulness.value) {
            setMinUsefulness(usefulness);
        } else
            enqueueSnackbar(
                "Cannot set minimum usefulness greater than maximum usefulness",
                { variant: "error" }
            );
    };

    const setMaxUsefulnessHelper = (usefulness) => {
        if (usefulness.value >= minUsefulness.value) {
            setMaxUsefulness(usefulness);
        } else
            enqueueSnackbar(
                "Cannot set maximum usefulness less than minimum usefulness",
                { variant: "error" }
            );
    };

    const setMinDifficultyHelper = (difficulty) => {
        if (difficulty.value <= maxDifficulty.value) {
            setMinDifficulty(difficulty);
        } else
            enqueueSnackbar(
                "Cannot set minimum difficulty greater than maximum difficulty",
                { variant: "error" }
            );
    };

    const setMaxDifficultyHelper = (difficulty) => {
        if (difficulty.value >= minDifficulty.value) {
            setMaxDifficulty(difficulty);
        } else
            enqueueSnackbar(
                "Cannot set maximum difficulty less than minimum difficulty",
                { variant: "error" }
            );
    };

    const setMinRatingHelper = (rating) => {
        if (rating.value <= maxRating.value) {
            setMinRating(rating);
        } else
            enqueueSnackbar(
                "Cannot set minimum rating greater than maximum rating",
                { variant: "error" }
            );
    };

    const setMaxRatingHelper = (rating) => {
        if (rating.value >= minRating.value) {
            setMaxRating(rating);
        } else
            enqueueSnackbar(
                "Cannot set maximum rating less than minimum rating",
                { variant: "error" }
            );
    };

    useEffect(() => {
        if (minRating.value > maxRating.value) {
            console.log("min rating cannot be greater than max rating");
        } else {
            setFilteredReviews(
                reviews.filter(
                    (review) =>
                        review.usefulness >= minUsefulness.value &&
                        review.usefulness <= maxUsefulness.value &&
                        review.difficulty >= minDifficulty.value &&
                        review.difficulty <= maxDifficulty.value &&
                        review.rating >= minRating.value &&
                        review.rating <= maxRating.value
                )
            );
        }
    }, [
        reviews,
        minUsefulness,
        maxUsefulness,
        minRating,
        maxRating,
        minDifficulty,
        maxDifficulty,
    ]);

    const [search, setSearch] = useState("");

    const handleReviewSearch = ({ searchText }) => {
        const searchLower = searchText.trim().toLowerCase();
        setSearch(searchLower);

        if (searchLower === "") {
            setFilteredReviews(reviews);
        } else {
            const searchFilteredReviews = reviews.filter((review) => {
                return (
                    (review.anon && "anonymous".includes(searchLower)) ||
                    (!review.anon &&
                        review.user.toLowerCase().includes(searchLower)) ||
                    review.professor.toLowerCase().includes(searchLower) ||
                    review.course_id.toLowerCase().includes(searchLower) ||
                    review.usefulness.toString().includes(searchLower) ||
                    review.difficulty.toString().includes(searchLower) ||
                    review.rating.toString().includes(searchLower) ||
                    review.review.toLowerCase().includes(searchLower)
                );
            });
            setFilteredReviews(searchFilteredReviews);
        }
    };

    return (
        <div>
            {view !== "account" && <h2 className="text-[#234c8b]">Reviews</h2>}
            <ReviewFilter
                minUsefulness={minUsefulness}
                setMinUsefulnessHelper={setMinUsefulnessHelper}
                maxUsefulness={maxUsefulness}
                setMaxUsefulnessHelper={setMaxUsefulnessHelper}
                minDifficulty={minDifficulty}
                setMinDifficultyHelper={setMinDifficultyHelper}
                maxDifficulty={maxDifficulty}
                setMaxDifficultyHelper={setMaxDifficultyHelper}
                minRating={minRating}
                setMinRatingHelper={setMinRatingHelper}
                maxRating={maxRating}
                setMaxRatingHelper={setMaxRatingHelper}
            />
            <div className="my-4">
                <input
                    placeholder="Search for review..."
                    name="review"
                    value={search}
                    className="w-48 h-8 p-2 border-1 border-gray-300 rounded-md"
                    onChange={(e) => {
                        handleReviewSearch({
                            searchText: e.target.value,
                        });
                    }}
                ></input>
            </div>
            <div className="w-144 max-w-full h-96 overflow-x-hidden overflow-y-scroll mx-auto flex flex-col justify-around border-2 border-[#234c8b]">
                {filteredReviews.map((review, index) => (
                    <Card
                        key={index}
                        className={`w-72 sm:w-112 max-w-full h-fit mx-2 mt-4 ${
                            index === filteredReviews.length - 1 && "mb-4"
                        } flex flex-col self-center flex-around border-1 border-gray-200 rounded-md`}
                    >
                        <Card.Header>
                            <div className="w-full mx-auto flex justify-between">
                                <p className="my-auto text-xl font-semibold text-right">
                                    {review.anon ? "Anonymous" : review.user}
                                </p>
                                <p className="my-auto text-xl font-semibold text-right">
                                    {formatDate(review.date)}
                                </p>
                            </div>
                        </Card.Header>
                        <Card.Body className="my-auto bg-[#baecba]">
                            <div className="w-full mx-auto sm:flex sm:justify-between">
                                <p className="text-xl text-left">
                                    Professor{" "}
                                    <span className="font-semibold">
                                        {review.professor}
                                    </span>
                                </p>
                                <p className="text-xl text-left">
                                    <span className="font-semibold">
                                        {review.course_id}
                                    </span>
                                </p>
                            </div>
                            <div className="w-full mx-auto sm:flex sm:justify-between">
                                <p className="text-xl text-left">
                                    Usefulness:{" "}
                                    <span className="text-2xl font-semibold">
                                        {review.usefulness}
                                    </span>
                                    /5
                                </p>
                                <p className="text-xl text-left">
                                    Difficulty:{" "}
                                    <span className="text-2xl font-semibold">
                                        {review.difficulty}
                                    </span>
                                    /5
                                </p>
                                <p className="text-xl text-left">
                                    Rating:{" "}
                                    <span className="text-2xl font-semibold">
                                        {review.rating}
                                    </span>
                                    /5
                                </p>
                            </div>
                            {review.review && (
                                <Card.Text className="w-full mx-auto text-xl text-start">
                                    {review.review}
                                </Card.Text>
                            )}
                            <div
                                className={`w-24 max-w-full mx-auto flex ${
                                    view === "account"
                                        ? "justify-between"
                                        : "justify-center"
                                }`}
                            >
                                {view === "account" && (
                                    <Link
                                        className="text-black"
                                        to={`/account/reviews/edit-review/${review._id}`}
                                    >
                                        <EditIcon />
                                    </Link>
                                )}
                                <DeleteReviewModal
                                    courseId={review.course_id}
                                    professor={review.professor}
                                    id={review._id}
                                    deleteItem="Review"
                                />
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
};

ReviewDisplay.propTypes = {
    reviews: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            user: PropTypes.string.isRequired,
            anon: PropTypes.bool.isRequired,
            bu_email: PropTypes.string.isRequired,
            course_id: PropTypes.string.isRequired,
            professor: PropTypes.string.isRequired,
            usefulness: PropTypes.number.isRequired,
            difficulty: PropTypes.number.isRequired,
            rating: PropTypes.number.isRequired,
            review: PropTypes.string,
            date: PropTypes.string.isRequired,
        })
    ),
    view: PropTypes.string,
};

export default ReviewDisplay;
