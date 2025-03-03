"use client";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation } from "swiper/modules";
import { AiOutlineDelete } from "react-icons/ai";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useFlowStore } from "@/store/flow.store";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const WorkflowIntentsSlider = () => {
  const {
    currentWorkflow,
    selectedIntentIndex,
    setSelectedIntentIndex,

    removeIntent,
  } = useFlowStore();
  const SwiperNavButtons = () => {
    const swiper = useSwiper();

    return (
      <div className="w-full flex gap-4 mt-6">
        <div
          className="flex justify-center items-center w-10 h-10 rounded-full border-2 border-blue-500 text-blue-500 text-base cursor-pointer"
          onClick={() => {
            if (selectedIntentIndex !== null && selectedIntentIndex > 0) {
              setSelectedIntentIndex(selectedIntentIndex - 1);
            }
            swiper.slidePrev();
          }}
        >
          <FiArrowLeft />
        </div>
        <div
          className="flex justify-center items-center w-10 h-10 rounded-full border-2 border-blue-500 text-blue-500 text-base cursor-pointer"
          onClick={() => {
            if (
              selectedIntentIndex !== null &&
              selectedIntentIndex < currentWorkflow.workflow_data.length - 1
            ) {
              setSelectedIntentIndex(selectedIntentIndex + 1);
            }
            swiper.slideNext();
          }}
        >
          <FiArrowRight />
        </div>
      </div>
    );
  };

  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-4">Workflow Intents</h2>

      {currentWorkflow.workflow_data.length > 0 ? (
        <div className="">
          <Swiper
            autoplay={{
              disableOnInteraction: false,
            }}
            breakpoints={{
              200: {
                slidesPerView: 1.0,
                spaceBetween: 8,
              },
              330: {
                slidesPerView: 1.2,
                spaceBetween: 10,
              },
              480: {
                slidesPerView: 1.5,
                spaceBetween: 12,
              },
              700: {
                slidesPerView: 2.4,
                spaceBetween: 14,
              },
              1000: {
                slidesPerView: 3.0,
                spaceBetween: 16,
              },
              1100: {
                slidesPerView: 3.1,
                spaceBetween: 18,
              },
              1200: {
                slidesPerView: 3.5,
                spaceBetween: 20,
              },
              1300: {
                slidesPerView: 3.9,
                spaceBetween: 22,
              },
              1400: {
                slidesPerView: 4.1,
                spaceBetween: 24,
              },
            }}
            className="w-full text-white h-full testimonial-swiper"
            modules={[Navigation]}
            slidesPerView={2.2}
          >
            {currentWorkflow.workflow_data.map((intent, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`p-4 rounded-lg shadow cursor-pointer h-full ${
                    selectedIntentIndex === index
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-white"
                  }`}
                  onClick={() => {
                    setSelectedIntentIndex(index);
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      Step {intent.step}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeIntent(index);
                      }}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete intent"
                    >
                      <AiOutlineDelete size={16} />
                    </button>
                  </div>
                  <h3 className="font-medium text-black">{intent.intent}</h3>
                  <p className="text-sm text-black line-clamp-2">
                    {intent.description}
                  </p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        intent.api.method === "GET"
                          ? "bg-blue-100 text-blue-800"
                          : intent.api.method === "POST"
                          ? "bg-green-100 text-green-800"
                          : intent.api.method === "PUT"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {intent.api.method}
                    </span>
                    <span className="text-xs text-gray-500 ml-2 truncate max-w-32">
                      {intent.api.url}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            {currentWorkflow.workflow_data.length > 1 && <SwiperNavButtons />}
          </Swiper>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">
            No intents added yet. Add an intent to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkflowIntentsSlider;
