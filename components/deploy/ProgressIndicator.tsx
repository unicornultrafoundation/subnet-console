"use client";

import { Check } from "lucide-react";

interface Tab {
  id: string;
  title: string;
  icon: any;
}

interface ProgressIndicatorProps {
  tabs: Tab[];
  currentTab: number;
}

export default function ProgressIndicator({
  tabs,
  currentTab,
}: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between">
          {tabs.map((tab, index) => {
            const isCompleted = index < currentTab;
            const isCurrent = index === currentTab;
            const isPending = index > currentTab;

            return (
              <div key={tab.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex items-center justify-center">
                  <div
                    className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg shadow-green-500/25"
                        : isCurrent
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500 text-white shadow-lg shadow-blue-500/25 animate-pulse"
                          : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="text-white" size={20} />
                    ) : (
                      <tab.icon size={20} />
                    )}

                    {/* Step Number */}
                    {!isCompleted && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">
                          {index + 1}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step Title */}
                <div className="ml-4 flex-1">
                  <div
                    className={`text-sm font-semibold transition-colors duration-300 ${
                      isCompleted
                        ? "text-green-600"
                        : isCurrent
                          ? "text-blue-600"
                          : "text-gray-500"
                    }`}
                  >
                    {tab.title}
                  </div>
                  <div
                    className={`text-xs transition-colors duration-300 ${
                      isCompleted
                        ? "text-green-500"
                        : isCurrent
                          ? "text-blue-500"
                          : "text-gray-400"
                    }`}
                  >
                    {isCompleted
                      ? "Completed"
                      : isCurrent
                        ? "In Progress"
                        : "Pending"}
                  </div>
                </div>

                {/* Connector Line */}
                {index < tabs.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={`h-0.5 rounded-full transition-all duration-500 ${
                        isCompleted
                          ? "bg-gradient-to-r from-green-500 to-emerald-500"
                          : "bg-gradient-to-r from-gray-200 to-gray-300"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentTab + 1) / tabs.length) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>
              Step {currentTab + 1} of {tabs.length}
            </span>
            <span>
              {Math.round(((currentTab + 1) / tabs.length) * 100)}% Complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
